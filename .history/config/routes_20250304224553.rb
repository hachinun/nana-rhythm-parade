Rails.application.routes.draw do
  resources :videos do
    collection { post :import }
    
    # videosリソース内でfavoritesリソースのtoggleアクションを設定
    member do
      post 'favorites/toggle', to: 'favorites#toggle'
    end
  end
end
