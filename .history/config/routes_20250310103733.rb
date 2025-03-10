Rails.application.routes.draw do
  # トップページにアクセスするルートを設定
  root 'videos#index'  # ここを追加

  resources :videos, param: :video_id do
    collection { post :import }
    
    # videosリソース内でfavoritesリソースのtoggleアクションを設定
    member do
      post 'favorites/toggle', to: 'favorites#toggle'
    end
  end
end
