function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

var carExchangeInstance;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  car: null,
  carVin: null,

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
    //load the user address
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        console.log("My address is : ", App.account);
      }
    });

    var carVin = parseInt(getUrlVars()["vin"]);
    App.carVin = carVin;


    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.getCar(App.carVin);
    }).then(function (res) {
      App.car = res;
      App.putResults();
    });
  },

  putResults: function () {
    $("#vin").html(App.carVin);
    $("#owner").html(App.car[1]);
    $("#value").html(App.car[0].toNumber() / 1000000000000000000);

    if (App.car[1] == App.account) {
      $("#buyForm").hide();
      if (App.car[2]) {
        $("#listForm").hide();
      }
      else {
        $("#listForm").show();
      }
    }
    else {
      $("#listForm").hide();
      $("#buyForm").show();
    }
  },

  list: function () {
    var value = $("#valueToList").val();
    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.list(App.carVin, web3.toWei(value, 'ether'), {from: App.account});
    }).then(function (receipt) {
      console.log(receipt);
      $('form').trigger('reset');
    })
  },

  buy: function () {
    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.buy(App.carVin, App.car[0], {from: App.account, value: App.car[0]})
    }).then(function (receipt) {
      console.log(receipt);
      $('form').trigger('reset');
    })
  }
};

$(document).ready(function () {
  App.init();
});
