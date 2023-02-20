let modalKey = 0
let quantProduto = 1
let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const real = (valor) => {
    return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

const abrirModal = () => {
    seleciona('.carrinhoWindowArea').style.opacity = 0
    seleciona('.carrinhoWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.carrinhoWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.carrinhoWindowArea').style.opacity = 0
    setTimeout(() => seleciona('.carrinhoWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.carrinhoInfo--cancelButton, .carrinhoInfo--cancelMobileButton').forEach((item) => item.addEventListener('click', fecharModal)
    )
}

const preencheDadosProdutos = (produtoItem, item, index) => {
    produtoItem.setAttribute('data-key', index)
    produtoItem.querySelector('.carrinho-item--img img').src = item.img
    produtoItem.querySelector('.carrinho-item--price').innerHTML = real(item.price)
    produtoItem.querySelector('.carrinho-item--name').innerHTML = item.name
    produtoItem.querySelector('.carrinho-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.carrinhoBig img').src = item.img
    seleciona('.carrinhoInfo h1').innerHTML = item.name
    seleciona('.carrinhoInfo--desc').innerHTML = item.description
    seleciona('.carrinhoInfo--actualPrice').innerHTML = real(item.price)
}

const pegarKey = (e) => {
    let key = e.target.closest('.carrinho-item').getAttribute('data-key')
    console.log('Produto clicado ' + key)
    console.log(produtosJson[key])

    quantProduto = 1
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {

    selecionaTodos('.carrinhoInfo--size').forEach((size, sizeIndex) => {

        size.addEventListener('click', (e) => {

            seleciona('.carrinhoInfo--size.selected').classList.remove('selected')

            size.classList.add('selected')
        
        })

    })
}



const mudarQuantidade = () => {
    seleciona('.carrinhoInfo--qtmais').addEventListener('click', () => {
        quantProduto++
        seleciona('.carrinhoInfo--qt').innerHTML = quantProduto
    })

    seleciona('.carrinhoInfo--qtmenos').addEventListener('click', () => {
        if(quantProduto > 1) {
            quantProduto--
            seleciona('.carrinhoInfo--qt').innerHTML = quantProduto
        }
    })
}




//*************************add no carrinho**************************/

const adicionarNoCarrinho = () => {
    seleciona('.carrinhoInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("Produto " + modalKey)
    	
	    let size = seleciona('.carrinhoInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    
    	console.log("Quant. " + quantProduto)
       
        let price = seleciona('.carrinhoInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
	    let identificador = produtosJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantProduto
        } else {
            let produto = {
                identificador,
                id: produtosJson[modalKey].id,
                size, 
                qt: quantProduto,
                price: parseFloat(price) 
            }
            cart.push(produto)
            console.log(produto)
            console.log('Sub total R$ ' + (produto.qt * produto.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    //console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }

}


const atualizarCarrinho = () => {
	seleciona('.menu-openner span').innerHTML = cart.length
	
	if(cart.length > 0) {

		seleciona('aside').classList.add('show')
		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

		for(let i in cart) {
			let produtoItem = produtosJson.find( (item) => item.id == cart[i].id )
			console.log(produtoItem)

        	subtotal += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let produtoSizeName = cart[i].size

			let produtoName = `${produtoItem.name} (${produtoSizeName})`

			cartItem.querySelector('img').src = produtoItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = produtoName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				cart[i].qt++
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					cart[i].qt--
				} else {
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 

		desconto = subtotal * 0
		total = subtotal - desconto


		seleciona('.subtotal span:last-child').innerHTML = real(subtotal)
		seleciona('.desconto span:last-child').innerHTML = real(desconto)
		seleciona('.total span:last-child').innerHTML    = real(total)

	} else {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}


produtosJson.map((item, index ) => {
    let produtoItem = document.querySelector('.models .carrinho-item').cloneNode(true)
    
    seleciona('.carrinho-area').append(produtoItem)

    preencheDadosProdutos(produtoItem, item, index)

    produtoItem.querySelector('.carrinho-item a').addEventListener('click', (e) => {
        e.preventDefault()

        let chave = pegarKey(e)

        abrirModal()
        preencheDadosModal(item)
        preencherTamanhos(chave)
        seleciona('.carrinhoInfo--qt').innerHTML = quantProduto

    })

    botoesFechar()
})


mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
