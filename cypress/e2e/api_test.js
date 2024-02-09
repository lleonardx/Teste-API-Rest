/// <reference types="cypress" />

describe('Testes de Usuario e Login', () => {

    it('Criar usuario com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                nome: "Leonardo Teste",
                email: "dev11@gmail.com",
                password: "testejava",
                administrador: 'true'
            },
        });
    });

    it('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'login',
            body: {
                "email": "dev11@gmail.com",
                "password": "testejava" 
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        });
    });

    it('Deve fazer login com login ou senha invalido', () => {
        cy.request({
            method: 'POST',
            url: 'login',
            body: {
                "email": "dev11@gmail.com",
                "password": "1234546565" 
            }
        }).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Email e/ou senha inválidos')
        });
    });

});

describe('Testes de Cadastro de Listagem de Produtos', () => {
    let token
    before(() => {
        cy.token('dev11@gmail.com', 'testejava').then(tkn => { token = tkn })
    });

    it('Deve cadastrar um produto com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": "Samsung Odyssey G9",
                "preco": 750,
                "descricao": "Monitor",
                "quantidade": 100
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, 'Samsung Odyssey G9', 750, "Monitor", 100)
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Deve listar os produtos cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(20)
        })
    });

});

