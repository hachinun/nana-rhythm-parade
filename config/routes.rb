Rails.application.routes.draw do
  resources :videos, param: :video_id do  # ← `param: :video_id` を追加
    collection { post :import }
    
    # videosリソース内でfavoritesリソースのtoggleアクションを設定
    member do
      post 'favorites/toggle', to: 'favorites#toggle'
    end
  end
end
