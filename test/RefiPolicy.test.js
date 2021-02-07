const RefiPolicy = artifacts.require("RefiPolicy");
const { LinkToken } = require("@chainlink/contracts/truffle/v0.4/LinkToken");
const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("RefiPolicy", ([owner, delegatee]) => {
  let dappToken, refiPolicy, linkToken;

  before(async () => {
    // Load Contracts
    refiPolicy = await RefiPolicy.new();
    // linkToken = await LinkToken.new()

  });


  describe("RefiPolicy deployment", async () => {
    it("has a name", async () => {
      const name = await refiPolicy.name();
      assert.equal(name, "refi");
    });
  });

  
  describe("creating Delegatee", async () => {
    it("adds a delegatee to an account", async () => {
      let result = [];
      await refiPolicy.addDelegatee(owner, delegatee);
      result = await refiPolicy.getDelegatee(owner);
      assert.equal(result[0].toString(), delegatee);
      
    });
  });
});
