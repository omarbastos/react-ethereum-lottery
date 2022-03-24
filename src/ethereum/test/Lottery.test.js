const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
        })
        .send({ from: accounts[0], gas: '1000000' });
});


describe('Manager', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('Manager has been set', async () => {
        const manager = await lottery.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('Allows to enter with right amount', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether'),
        });
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert.ok(players.includes(players[0])) ;
        assert.equal(1, players.length);
    });
    it('Allows to enter multiple accounts', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether'),
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether'),
        });
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert.ok(players.includes(accounts[0])) ;
        assert.ok(players.includes(accounts[1])) ;
        assert.equal(2, players.length);
        const balance = await lottery.methods.getBalance().call({from: accounts[0]});
        assert.equal(web3.utils.toWei('0.04', 'ether'), balance);
    });
    it('Requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0,
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    it('Requires manager to pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({from: accounts[1]});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    it('should sends money to the winner and resets the players', async ()=> {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether'),
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert.equal(0, players.length);

    });
});