Rails.application.routes.draw do
  resources :videos do
    collection { post :import }
    
    # videosリソース内でfavoritesリソースのtoggleアクションを設定
    resources :favorites, only: [] do
      post :toggle, on: :collection
    end
  end
end
