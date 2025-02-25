export function calculateDiscountPrice(promotion) {
    const price = promotion.price;
    const promotionType = promotion.promotion_type;
    const discountRate = promotion.discount_rate;
    const reduceAmount = promotion.reduce_amount;

    let discountPrice;
    switch (promotionType) {
        case "DISCOUNT":
            // 折扣类型，折扣价格 = 原价 * 折扣率
            discountPrice = price * discountRate;
            break;
        case "REDUCE_AMOUNT":
            // 满减类型，折扣价格 = 原价 - 满减金额
            discountPrice = price - reduceAmount;
            break;
        case "BUY_ONE_GET_ONE":
            // 买一送一类型，折扣价格 = 原价 / 2
            discountPrice = price / 2;
            break;
        case "FREE_SHIPPING":
            // 免运费类型，折扣价格等于原价
            discountPrice = price;
            break;
        default:
            // 未知促销类型，折扣价格等于原价
            discountPrice = price;
    }
    return discountPrice;
}