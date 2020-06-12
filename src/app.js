App = {
    loading: false,
    contracts: {},

    load: async () => {
        // await App.loadWeb3()
        // await App.loadAccount()
        // await App.loadContract()
        // await App.render()
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    
    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const transacoes = await $.getJSON('Transacoes.json')
        App.contracts.Transacoes = TruffleContract(transacoes)
        App.contracts.Transacoes.setProvider(App.web3Provider)
    
        // Hydrate the smart contract with values from the blockchain
        App.transacoes = await App.contracts.Transacoes.deployed()
    },

    render: async () => {
        // Prevent double render
        if (App.loading) {
          return
        }
    
        // Update app loading state
        App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render Tasks
        await App.renderTasks()
    
        // Update loading state
        App.setLoading(false)
    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        const qntdTransacoes = await App.transacoes.qntdTransacoes()
        const $taskTemplate = $('.taskTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= qntdTransacoes; i++) {
            //    Fetch the task data from the blockchain
            const transacao = await App.transacoes.transacoes(i)
            const id = transacao[0].toNumber()
            const comprador = transacao[1]
            const vendedor = transacao[2]
            const produto = transacao[3]
            const preco = transacao[4].toNumber()
            const quantidade = transacao[5].toNumber()
            const info_adicionais = transacao[6]
            const finalizada = transacao[7]

            // Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.id').html(id)
            $newTaskTemplate.find('.comprador').html(comprador)
            $newTaskTemplate.find('.vendedor').html(vendedor)
            $newTaskTemplate.find('.produto').html(produto)
            $newTaskTemplate.find('.preco').html(preco)
            $newTaskTemplate.find('.quantidade').html(quantidade)
            $newTaskTemplate.find('.info_adicionais').html(info_adicionais)
            // $newTaskTemplate.find('input')
            //             .prop('name', id)
            //             .prop('checked', finalizada)
                        // .on('click', App.toggleCompleted)
    
            // Put the task in the correct list
            if (finalizada) {
                $('#transacoesFinalizadas').append($newTaskTemplate)
            } else {
                $('#transacoes').append($newTaskTemplate)
            }
        
            // Show the task
            $newTaskTemplate.show()
        }
    },
    
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    },
}

$(() => {
    $(window).load(() => {
      App.load()
    })
})