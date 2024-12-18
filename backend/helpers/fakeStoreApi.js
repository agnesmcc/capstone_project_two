/**
 * Returns a random product from the fake store API. Note that the endpoint
 * returns a list of products, twenty to be exact. The fake store API does not
 * have an endpoint for getting a random product so this function does that.
 *
 * @returns {Promise<Object>} The product returned as a JSON object.
 */
const getRandomProduct = async () => {
    const product = await fetch('https://fakestoreapi.com/products').then(res=>res.json())
    return product[Math.floor(Math.random() * product.length)]
}

module.exports = {
    getRandomProduct
}
