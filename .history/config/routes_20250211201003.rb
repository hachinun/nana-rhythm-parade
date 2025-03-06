Rails.application.routes.draw do
  resources :videos do
    collection { post :import }
    resources :favorites, only: [] do
      post :toggle, on: :collection
    end    
    
  end
end