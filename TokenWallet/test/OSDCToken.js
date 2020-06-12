const OSDCToken = artifacts.require("OSDCToken");

contract('OSDCToken', (accounts) => {
  it('should put 100000000000 OSDCToken in the first account', async () => {
    const OSDTCTokenInstance = await OSDCToken.deployed();
    const balance = await OSDTCTokenInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.toNumber(), 100000000000, "100000000000 wasn't in the first account");
  });

  it('should send OSDCToken correctly', async () => {
    const OSDTCTokenInstance = await OSDCToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await OSDTCTokenInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await OSDTCTokenInstance.balanceOf.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 500000;
    await OSDTCTokenInstance.transfer(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await OSDTCTokenInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await OSDTCTokenInstance.balanceOf.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});
