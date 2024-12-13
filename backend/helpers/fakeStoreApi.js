const getRandomProduct = async () => {
    const product = await fetch('https://fakestoreapi.com/products').then(res=>res.json())
    return product[Math.floor(Math.random() * product.length)]
}

module.exports = {
    getRandomProduct
}
