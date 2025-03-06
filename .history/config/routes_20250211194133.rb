Rails.application.routes.draw do
  resources :videos do
    collection { post :import }
    resource :favorite, only: [:create, :destroy]
  end
end