/**
/**
 * @title: Idle Badger wrapper
 * @summary: Used for interacting with Badger. Has
 *           a common interface with all other protocol wrappers.
 *           This contract holds assets only during a tx, after tx it should be empty
 * @author: Idle Labs Inc., idle.finance
 */
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/ILendingProtocol.sol";
import "hardhat/console.sol";

interface IBadger {
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function token() external view returns(address);
  function getPricePerFullShare() external view returns(uint256);
}

contract IdleBadger is ILendingProtocol, Ownable {
  using SafeERC20 for IERC20;
  using SafeMath for uint256;

  // protocol token (Badger bBadger) address
  address public token; // Badger sett vault: 0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28

  // underlying token (token eg badger) address
  address public underlying;
  address public idleToken;
  bool public initialized;

  // address public controller = 0x41Ab25709e0C3EDf027F6099963fE9AD3EBaB3A3; // Badger Controller
  // address public compoundProvider = 0xDAA037F99d168b552c0c61B7Fb64cF7819D78310; // Badger CompoundProvider
  // address public cErc20 = 0x39AA39c021dfbaE8faC545936693aC917d5E7563; // cToken

  /**
   * @param _token : Badger bBadger address
   * @param _idleToken : idleToken address
   */
  function initialize(address _token, address _idleToken) public {
    require(!initialized, "Already initialized");
    require(_token != address(0), 'bBadger: addr is 0');

    token = _token;
    underlying = address(IBarnBridge(_token).token());
    idleToken = _idleToken;
    IERC20(underlying).safeApprove(token, 0);
    IERC20(underlying).safeApprove(token, uint256(-1));
    initialized = true;
  }

  /**
   * Throws if called by any account other than IdleToken contract.
   */
  modifier onlyIdle() {
    require(msg.sender == idleToken, "Ownable: caller is not IdleToken");
    _;
  }
  
  function nextSupplyRateWithParams(uint256[] calldata)
    external view override
    returns (uint256) {
    return 0;
  }

  /**
   * Calculate next supply rate for bBadger, given an `_amount` supplied
   *
   * @param _amount : new underlying amount supplied (eg badger token)
   * @return : yearly net rate
   */
  function nextSupplyRate(uint256 _amount) public override view returns (uint256) {
    return 0;
  }

  /**
   * @return current price of bBadger Badger in underlying, Badger bBadger price is always 1
   */
  function getPriceInToken()
    public override view
    returns (uint256) {
      return IBadger(token).getPricePerFullShare();
  }

  /**
   * @return apr : current yearly net rate
   */
  function getAPR()
    external view override
    returns (uint256) {
      return 0; 
  }

  /**
   * Gets all underlying tokens in this contract and mints bBadgerTokens Tokens
   * tokens are then transferred to msg.sender
   * NOTE: underlying tokens needs to be sent here before calling this
   * NOTE2: given that bBadgerTokens price is always 1 token -> underlying.balanceOf(this) == token.balanceOf(this)
   *
   * @return bBadgerTokens Tokens minted
   */
  function mint()
    external override
    onlyIdle
    returns (uint256 bBadgerTokens) {
      uint256 balance = IERC20(underlying).balanceOf(address(this));
      if (balance == 0) {
        return bBadgerTokens;
      }


      IBadger(token).deposit(
        balance
      );  // Badger external function call to stake

      bBadgerTokens = IERC20(token).balanceOf(address(this));
      IERC20(token).safeTransfer(msg.sender, bBadgerTokens);
  }
  /**
   * Gets all bBadgerTokens in this contract and redeems underlying tokens.
   * underlying tokens are then transferred to `_account`
   * NOTE: bBadgerTokens needs to be sent here before calling this
   *
   *  underlying tokens redeemd
   */
  function redeem(address _account)
    external override
    onlyIdle
    returns (uint256 tokens) {

    IBadger(token).withdraw(
      IERC20(token).balanceOf(address(this))
    ); // Badger external function call to redeem

    IERC20 _underlying = IERC20(underlying);
    tokens = _underlying.balanceOf(address(this));
    _underlying.safeTransfer(_account, tokens);
  }

  /**
   * Get the underlying balance on the lending protocol
   *
   * @return underlying tokens available
   */
  function availableLiquidity() external override view returns (uint256) {
    return IERC20(underlying).balanceOf(token);
  }
}
