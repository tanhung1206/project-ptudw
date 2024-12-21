const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturersModel = require("../models/manufacturersModel");
const { pagination, prices } = require("../config/config");

// Route trang About
router.get('/', async (req, res) => {
    const curPage = +req.query.page || 1;
    const categoryId = +req.query.categoryId;
    const manufacturerId = +req.query.manufacturerId;
    const stars = +req.query.stars;
    const name = req.query.name;
    const price = +req.query.price;

    const offset = (curPage - 1) * pagination.limit

    const aQuery = [];
    const aCondition = [];
    if (name) {
        aQuery.push(`name=${name}`);
        aCondition.push(`name ilike '%${name}%'`);
    }
    if (categoryId) {
        aQuery.push(`categoryId=${categoryId}`);
        aCondition.push(`categoryId=${categoryId}`);
    }
    if (manufacturerId) {
        aQuery.push(`manufacturerId=${manufacturerId}`);
        aCondition.push(`manufacturerId=${manufacturerId}`);
    }
    if (stars) {
        aQuery.push(`stars=${stars}`);
        aCondition.push(`stars=${stars}`);
    }
    if (price >= 0) {
        aQuery.push(`price=${price}`);
        if (price == 3) {

            aCondition.push(`price >= ${prices[price].from}`)
        }
        else {
            aCondition.push(`price between ${prices[price].from} and ${prices[price].to}`);
        }
    }
    const query = aQuery.join("&");
    const condition = aCondition.join(" and ");


    const [products, categories, manufacturers, totalResult] = await Promise.all([
        productsModel.filterByCondition(condition, pagination.limit, offset),
        categoriesModel.findAll(),
        manufacturersModel.findAll(),
        productsModel.countByCondition(condition)]);

    const totalPages = Math.ceil(+totalResult[0].total / pagination.limit);
    const prevPage = curPage - 1 >= 1 ? curPage - 1 : undefined;
    const nextPage = curPage + 1 <= totalPages ? curPage + 1 : undefined;

    res.render('products', {
        title: 'Our Shop',
        message: 'Shop',
        currentPage: 'shop',
        products,
        categories,
        manufacturers,
        curPage,
        categoryId,
        manufacturerId,
        price,
        stars,
        query,
        prevPage,
        nextPage,
        totalPages,
        name,
        prices
    });
});

router.get('/:id', async (req, res) => {
    const id = +req.params.id;
    const product = (await productsModel.findOne(id))[0]
    const relatedProducts = await productsModel.findRelated(id, product.categoryid, 4)
    const reviews = await productsModel.findAllReviews(id);
    const reviews_count = reviews.length;
    const user = req.user;
    const average_star = reviews.reduce((total, cur) => total + cur.stars, 0) / reviews_count;
    const rounded_average_star = Math.round(average_star);

    res.render('detail', {
        title: 'Shop Detail',
        message: 'Shop Detail',
        currentPage: 'shop',
        product,
        relatedProducts,
        reviews,
        reviews_count,
        user,
        average_star,
        rounded_average_star
    });
});

router.post('/:id/review', async (req, res) => {
    const userid = req.user.userid;
    const productid = +req.params.id;
    const { stars, review } = req.body;

    try {
        await productsModel.addReview(productid, userid, stars, review);
        const formattedDate = new Date(Date.now() + 7 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).replace(/,/g, '');

        res.json({
            success: true,
            data: {
                stars,
                review,
                username: req.user.username,
                avatar: req.user.avatar,
                createdat: formattedDate
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

module.exports = router;