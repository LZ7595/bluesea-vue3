export function getImageUrlArray(ArrayObject) {
    if (!ArrayObject) {
        return [];
    }
    if (typeof ArrayObject.image_url === 'string') {
        // 使用正则表达式匹配字符串中的图片路径，并将其转换为数组
        const matches = ArrayObject.image_url.match(/\/goods\/[^'"\[\]]+/g);
        return matches ? matches : [];
    } else {
        return ArrayObject.image_url;
    }
}

export function getFirstImageUrl(imageUrlArray) {
    return imageUrlArray[0];
}
