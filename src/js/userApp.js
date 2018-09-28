var carExchangeInstance;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  ownedCars: null,

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

    content.hide();
    loader.show();

    //load the user address
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        console.log("My address is : ", App.account);
      }
    });

    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.ownedCars(App.account);
    }).then(function (cars) {
      console.log("User has ", cars.length);

      $("#numCarsRegistered").html(cars.length);

      App.ownedCars = cars;
      App.putResults();

      loader.hide();
      content.show();
    });
  },

  register: function () {
    var vinNumber = $("#vinToRegister").val();
    App.contracts.CarExchange.deployed().then(function (instance) {
      carExchangeInstance = instance;
      return carExchangeInstance.register(App.account, vinNumber);
    }).then(function (receipt) {
      console.log(receipt);
      $('form').trigger('reset');
    })
  },

  listenForEvents: function () {
    console.log("listenForEvents");
    App.contracts.CarExchange.deployed().then(function (instance) {
      instance.Registered({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function (error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  putResults: function () {
    var i = 0;
    for (i = 0; i < App.ownedCars.length; i++) {
      $("#results").append("<br />");
      $("#results").append("<a class='text-center' href='detail.html?vin=" + App.ownedCars[i].toString(10) + "'>Car : " + App.ownedCars[i].toString(10) + "</a>");
      $("#results").append("<hr />")
    }
  }
};

$(document).ready(function () {
  App.init();
});
