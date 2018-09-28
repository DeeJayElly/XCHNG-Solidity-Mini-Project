var carExchangeInstance;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  vinNumberList: null,
  valueList: null,
  ownerList: null,
  numberListedCars: null,

  init: function () {
    console.log("App initialized");
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function () {
    $.getJSON("CarExchange.json", function (CarExchange) {
      App.contracts.CarExchange = TruffleContract(CarExchange);
      App.contracts.CarExchange.setProvider(App.web3Provider);
      App.contracts.CarExchange.deployed().then(function (CarExchange) {
        console.log("CarExchange contract at address:", CarExchange.address);
      });
    }).done(function () {
      return App.render();
    });
  },

  render: function () {
    if (App.loading) return;
    App.loading = true;
    loader = $("#loader");
    content = $("#content");

    loader.show();
    content.hide();

    //load the user address
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        console.log("My address is : ", App.account);
      }
    });

    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.getAllListedCars();
    }).then(function (res) {
      App.numberListedCars = parseInt(res[0]);
      App.vinNumberList = res[1];
      App.valueList = res[2];
      App.ownerList = res[3];

      $("#numberListedCars").html(App.numberListedCars);

      loader.hide();
      content.show();

      App.putResults();
    });
  },

  putResults: function () {
    var i = 0;
    for (i = 0; i < App.numberListedCars; i++) {
      $("#results").append("<br />");
      $("#results").append("<a href='detail.html?vin=" + App.vinNumberList[i].toNumber() + "'>Car : " + App.vinNumberList[i].toNumber() + "</a> <span class='text-center'>  user : " + App.ownerList[i].toString(10) + "</span>  <span class='pull-right'> Value: " + App.valueList[i].toNumber() / 1000000000000000000 + " Ether</span>");
      $("#results").append("<hr />")
    }
  }
};

$(document).ready(function () {
  App.init();
});
