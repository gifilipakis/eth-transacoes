pragma solidity ^0.5.0;

contract Transacoes {
    uint public qntdTransacoes = 0;

    struct Transacao {
        uint id;
        string comprador;
        string vendedor;
        string produto;
        uint preco;
        uint quantidade;
        string info_adicionais;
        bool finalizada;
    }

    mapping(uint => Transacao) public transacoes;

    constructor() public {
        criarTransacao("Nome do Comprador", "Nome do Vendedor", "Nome do Produto", 0, 0, "Informações importantes adicionais");
    }

    function criarTransacao(string memory _comprador, string memory _vendedor, string memory _produto, 
    uint _preco, uint _quantidade, string memory _info_adicionais) public {
        qntdTransacoes ++;
        transacoes[qntdTransacoes] = Transacao(qntdTransacoes, _comprador, _vendedor, _produto, _preco, _quantidade, _info_adicionais, false);
    }
}