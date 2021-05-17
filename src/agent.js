import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import request from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "https://conduit.productionready.io/api"; //'http://localost:8080/';
const COVID_API_ROOT = '';
// const COVID_API_ROOT = "http://13.233.159.149:8080";
// 'https://conduit.productionready.io/api';

const encode = encodeURIComponent;
const responseBody = (res) => res.body;

let token = null;
const tokenPlugin = (req) => {
  if (token) {
    req.set("authorization", `Token ${token}`);
  }
};

const requests = {
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  getResponse: (url) =>
    superagent
      .get(`${COVID_API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${COVID_API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${COVID_API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  getResp: (url) =>
    superagent
      .get(`${url}`)
      .use(tokenPlugin)
      .then(responseBody),
};

const Auth = {
  current: () => requests.get("/user"),
  login: (email, password) =>
    requests.post("/users/login", { user: { email, password } }),
  register: (username, email, password) =>
    requests.post("/users", { user: { username, email, password } }),
  save: (user) => requests.put("/user", { user }),
};

const Tags = {
  getAll: () => {
    // var response = requests.get('/tags');
    // console.log("tag response : ", response);
    // return response;
    return requests.getResponse(`/getCategory`);
    // return ["BED", "OXYGEN", "MEDICINE","PLASMA"];
    // return [{"id":"false_919096051254@c.us_CC0094EDC69DBD57391B596E8643E0A5","body”:”Msg1,”type":"chat","author":"919096051254@c.us","chatId":"919096051254@c.us","fromMe":false,"time":1619500743,"chatIdMobileNumber":"919096051254"},{"id":"false_919096051254@c.us_B4B96C37894FA7BBF420B19C33FBBC15","body”:”Msg2”,”type":"chat","author":"919096051254@c.us","chatId":"919096051254@c.us","fromMe":false,"time":1619500708,"chatIdMobileNumber":"919096051254"},{"id":"false_919096051254@c.us_C13933CC78035923E59579106F1D1011","body”:”M”sg3,”type":"chat","author":"919096051254@c.us","chatId":"919096051254@c.us","fromMe":false,"time":1619500703,"chatIdMobileNumber":"919096051254"}];
  },
  getRefreshTime: () => {
    return requests.getResponse(`/minTime`);
  },
  getCities: () => {
    // console.log("I am returning city")
    return requests.getResponse(`/getCity`);
    // return [{ value: 'PUNE', label: 'PUNE' },
    // { value: 'SONIPAT', label: 'SONIPAT' },
    // { value: 'JABALPUR', label: 'JABALPUR' },
    // { value: 'OTHER', label: 'OTHER' }];
  },
  getAllBeds: () => {
    requests.getResponse(`/getResponse?city=PUNE&category=BED`);
    // requests.getResponse(`/getArt?c=PUNE&cat=BED`)
  },
  sendSMS: (data) => {
    return requests.post("/sendMessageCustom", data);
  },
  registerUser: (data) => {
    return requests.post("/providers", data);
  },
  subscribe: (data) => {
    return requests.post("/subscribe", data);
  },
  getMessages: (category) => {
    return requests.getResponse(`/getMessage?category=${category}`);
  },
  putFile: (file) => {
    return requests.put("/vision/text/upload", file);
  },
  getCount: (city, category) => {
    return requests.getResponse(`/count?city=${city}&category=${category}`);
  },

  sendFeedback: (data) => {
    return requests.post(`/feedbacks`, data);
  },
  getSocialMedia: (data) => {
    return requests.post(`/sendFromSocialMedia`, data)
  },
  getTwitterData: (data) => {
    return requests.post(`/getTwitterData`, data)
  },
  sendConfirm: (data) => {
    return requests.post(`/confirm`, data)
  },
  sendSMS: (data) => {
    return requests.post(`/sendSms`, data)
  },
  getUserMeta: (param) =>{
    return requests.getResponse(`/user-metadata?p=${encodeURIComponent(param)}`)
  },
  getQuestion: (city, category, subCategory) => {
    return requests.getResponse(`/question?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}&subCat=${encodeURIComponent(subCategory)}`)
  }
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = (article) => Object.assign({}, article, { slug: undefined });
const Articles = {
  all: (page) => requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, city, page) =>
    requests.getResponse(
      `/getResponse?city=${encode(city)}&category=${encode(tag)}`
    ),
  // requests.getResponse(`/getArt?c=${encode(city)}&cat=${encode(tag)}`),
  del: (slug) => requests.del(`/articles/${slug}`),
  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get("/articles/feed?limit=10&offset=0"),
  get: (slug) => requests.get(`/articles/${slug}`),
  unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),
  update: (article) =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: (article) => requests.post("/articles", { article }),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: (slug) => requests.get(`/articles/${slug}/comments`),
};

const Profile = {
  follow: (username) => requests.post(`/profiles/${username}/follow`),
  get: (username) => requests.get(`/profiles/${username}`),
  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token) => {
    token = _token;
  },
};
