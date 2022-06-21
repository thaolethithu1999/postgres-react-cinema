export const config = {
  authentication_url: 'http://localhost:8082',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8082/users',
  role_url: 'http://localhost:8083/roles',
  privilege_url: 'http://localhost:8080/privileges',
  audit_log_url: 'http://localhost:8080/audit-logs',
  cinema_url: 'http://localhost:8080/cinema', //8080
  category_url: 'http://localhost:8080/categories',
  film_url: 'http://localhost:8080/films',
  location_backoffice_url: 'http://localhost:8082/locations',//change port 8085
  location_url: 'http://localhost:8082/locations', //change port 8085
  location_rate_url: 'http://localhost:8082/location-rates',
  myprofile_url: 'http://localhost:8082/my-profile',
  appreciation_url: 'http://localhost:8082/appreciation',
  profile_url: 'http://localhost:8082/users',
  skill_url: 'http://localhost:8082/skills',
  interest_url: 'http://localhost:8082/interests',
  looking_for_url: 'http://localhost:8082/looking-for',
  article_url: 'http://localhost:8085/articles',
  my_article_url: 'http://localhost:8082/my-articles',
  item_url: 'http://localhost:8085/articles',
  appreciation_reply_url:'http://localhost:8082/appreciation-reply'
};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
