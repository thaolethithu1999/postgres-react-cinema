export const config = {
  authentication_url: 'http://localhost:8082',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8082/users',
  role_url: 'http://localhost:8083/roles',
  privilege_url: 'http://localhost:8080/privileges',
  audit_log_url: 'http://localhost:8080/audit-logs',
  cinema_url: 'http://localhost:8080/cinema',
  category_url: 'http://localhost:8080/categories',
  film_url: 'http://localhost:8080/films',
  film_rate_url: 'http://localhost:8080/film-rate',
  location_backoffice_url: 'http://localhost:8085/locations',
  location_url: 'http://localhost:8082/locations',
  location_rate_url: 'http://localhost:8082/location-rates',
  myprofile_url: 'http://localhost:8082/my-profile',
  appreciation_url: 'http://localhost:8082/appreciation',
  profile_url: 'http://localhost:8082/users',
  skill_url: 'http://localhost:8082/skills',
  interest_url: 'http://localhost:8082/interests',
  looking_for_url: 'http://localhost:8082/looking-for',
  article_url: 'http://localhost:8082/articles',
  my_article_url: 'http://localhost:8082/my-articles',
  item_url: 'http://localhost:8082/items',
  appreciation_reply_url:'http://localhost:8082/appreciation-reply',
  cinema_rate_url:'http://localhost:8080/cinema-rate',
  rate_url:'http://localhost:8080/rates',
  comment_url: 'http://localhost:8082/comment',
  my_item_url: 'http://localhost:8082/my-items',
};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
