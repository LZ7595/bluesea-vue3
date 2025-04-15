<template>
    <div class="productDetails-pages">
        <div class="viewport">
            <div class="productDetails-Breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/pc/search' }">{{ brand }}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:`/pc/productDetails/${product_id}`}">{{
                        product_name
                        }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="productDetails-div">
                <div v-if="loading">Loading...</div>
                <div v-else-if="error">{{ error }}</div>
                <div class="productDetails" v-else>
                    <div class="productDetails-info-top">
                        <div class="productDetails-img">
                            <Carousel :carouselItems="image_url"/>
                        </div>
                        <div class="productDetails-content">
                            <div class="productDetails-data">
                                <p class="data-name">{{ product_name }}<!-- 如果有折扣，显示限时抢购提示 -->
                                    <el-tag v-if="hasDiscount" style="margin-left: 20px" type="danger" effect="dark">
                                        限时抢购
                                    </el-tag>
                                </p>
                                <div>
                                    <p>
                                        价格:
                                        <span class="data-price">
                                            ￥{{ displayPrice }}
                                        </span>
                                        <!-- 如果有折扣价，显示原价 -->
                                        <span v-if="hasDiscount" class="data-OldPrice">
                                            <del>￥{{ price }}</del>
                                        </span>
                                    </p>
                                    <p>配送: <span class="data-stock">{{ stock >= 1 ? '有货' : '无货' }}</span></p>
                                </div>
                            </div>
                            <div class="productDetails-actions">
                                <el-input-number v-model="payNum" :min="1" :max="stock" v-if="stock"/>
                                <div>
                                    <el-button type="primary" size="large" plain @click="addMyCart(product_id)"
                                               :disabled="!stock">
                                        加入购物车
                                    </el-button>
                                    <el-button type="primary" size="large" @click="buyNow(product_id)"
                                               :disabled="!stock">立即购买
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="productDetails-info-bottom">
                        <el-tabs type="border-card">
                            <el-tab-pane label="商品详情">
                                <el-descriptions border label-width="100px">
                                    <el-descriptions-item label="商品名字">{{ product_name }}</el-descriptions-item>
                                </el-descriptions>
                                <el-descriptions border label-width="100px">
                                    <el-descriptions-item label="品牌">{{ brand }}</el-descriptions-item>
                                    <el-descriptions-item label="商品编号">{{ product_id }}</el-descriptions-item>
                                    <el-descriptions-item label="成色">{{ quality }}新</el-descriptions-item>
                                    <el-descriptions-item label="激活日期"></el-descriptions-item>
                                    <el-descriptions-item label="充电次数"></el-descriptions-item>
                                    <el-descriptions-item label="电池寿命"></el-descriptions-item>
                                    <el-descriptions-item label="描述">{{ description }}</el-descriptions-item>
                                </el-descriptions>
                            </el-tab-pane>
                            <el-tab-pane label="商品评价">
                                <div v-if="comment.length > 0">
                                <h1>商品评价</h1>
                                <div class="review-list">
                                    <div class="review-card" v-for="review in comment" :key="review.review_id">
                                        <ReviewCard :review="review"/>
                                    </div>
                                </div>
                                <div class="pagination">
                                    <el-pagination
                                            v-model:current-page="currentPage"
                                            :total="commentNum"
                                            v-model:page-size="pageSize"
                                            layout="prev, pager, next"
                                            @current-change="handleCurrentChange"
                                    />
                                </div>
                                </div>
                                <div v-else>
                                    <h1>暂无评价</h1>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ArrowRight} from "@element-plus/icons-vue";
import productRes from "@/request/product";
import {computed, onMounted, ref, watch} from "vue";
import Carousel from "@/components/pc/product/Carousel.vue";
import ReviewCard from "@/components/pc/review/reviewCard.vue";
import cartRes from "@/request/shoppingCart";
import {ElMessage} from "element-plus";
import commentApi from "@/request/comment.js";

const route = useRoute();
const router = useRouter();
const product_id = route.params.product_id;
const productData = ref({});
const flashSaleData = ref({});
const discount_price = ref(0)
const loading = ref(true);
const error = ref('');
const payNum = ref(1);
const user_id = ref(null);
const comment = ref([]);
const commentNum = ref(0);
// 每页显示的商品数量，初始为 10 条
const pageSize = ref(10);
// 商品的总记录数，初始为 0
const total = ref(0);
const currentPage = ref(1);
const addMyCart = async (product_id) => {
    try {
        user_id.value = JSON.parse(localStorage.getItem('UserData')).id
        const res = await cartRes.addCart(user_id.value, product_id, payNum.value)
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getComment();
};
const getProductDetails = async () => {
    try {
        const res = await productRes.getProudctDetails(product_id);
        productData.value = res;
        flashSaleData.value = res.promotions;
        loading.value = false;
        console.log(res)
    } catch (err) {
        console.error(err);
        error.value = '获取产品详情时出错，请稍后重试';
        loading.value = false;
    }
};

const getComment = async () => {
    try {
        await commentApi.getCommentByProductId(product_id, currentPage.value, pageSize.value).then(res => {
            comment.value = res.data.reviews;
            commentNum.value = res.data.total;
        })
    } catch (err) {
        console.error(err);
        error.value = '获取产品详情时出错，请稍后重试';
        loading.value = false;
    }
}

const buyNow = async (productId) => {
    try {
        user_id.value = JSON.parse(localStorage.getItem('UserData')).id;
        const orderData = {
            userId: user_id.value,
            orderItems: [
                {
                    productId: Number(productId),
                    quantity: 1,
                    unitPrice: price.value,
                }
            ]
        };

        // 跳转到确认订单页，并传递订单数据
        router.push({
            name: 'PlaceOrder',
            query: {
                orderData: JSON.stringify(orderData)
            }
        });
    } catch (error) {
        console.error('跳转到确认订单页失败:', error);
        ElMessage.error('操作失败，请稍后重试');
    }
};

onMounted(() => {
    getProductDetails();
    getComment();
});

const product_name = computed(() => productData.value.product_name);
const description = computed(() => productData.value.product_description);
const price = computed(() => productData.value.price);
// 计算属性判断是否有折扣
const hasDiscount = computed(() => {
    if (flashSaleData.value && flashSaleData.value.length > 0) {
        // 假设 flashSaleData.value 是一个包含多个优惠的数组
        const cheapestDiscount = flashSaleData.value.reduce((prev, current) => {
            return prev.discount_price < current.discount_price ? prev : current;
        });
        return cheapestDiscount.discount_price;
    }
    return false;
});
// 计算属性获取显示价格，优先显示折扣价
const displayPrice = computed(() => {
    return hasDiscount.value ? hasDiscount.value : price.value;
});
const image_url = computed(() => productData.value.imageUrls);
const brand = computed(() => productData.value.brand_name);
const quality = computed(() => productData.value.quality);
const stock = computed(() => productData.value.stock);
</script>
<style lang="scss" scoped>
.productDetails-pages {
  min-height: 100vh;
  background-color: #f6f6f6;
  padding-bottom: 45px;

  .productDetails-Breadcrumb {
    padding: 15px 0;
  }

  .productDetails-div {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;

    .productDetails {

      .productDetails-info-top {
        display: flex;

        .productDetails-content {
          width: 660px;
          height: 500px;
          padding: 30px 20px;

          .productDetails-data {
            height: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            p {
              font-size: 18px;
              margin-bottom: 10px;
              word-wrap: break-word;
            }

            .data-name {
              font-size: 24px;
            }

            .data-price, .data-OldPrice {
              padding-left: 10px;
              font-size: 26px;
              font-weight: bold;
              color: #e4393c;
            }

            .data-OldPrice {
              font-size: 16px;
              text-decoration: line-through;
              color: #999;
            }

            .data-stock {
              font-weight: bold;
            }
          }

          .productDetails-actions {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 220px;

            button {
              width: 200px;
              height: 40px;
            }
          }
        }
      }

      .productDetails-info-bottom {
        .info-select {
          width: 100%;
          height: 80px;
        }

        .review-list {
          .review-card {
            width: 100%;
            padding: 15px 10px;

            &:not(:last-child)::after {
              content: '';
              display: block;
              height: 1px;
              background-color: #e0e0e0;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }
}
</style>