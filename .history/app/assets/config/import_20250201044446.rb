# config/importmap.rb
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "https://cdn.skypack.dev/@hotwired/turbo-rails"
pin_all_from "app/javascript", under: "application"
