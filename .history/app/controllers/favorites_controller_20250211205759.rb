class FavoritesController < ApplicationController
  before_action :authenticate_user!

  # お気に入りを追加または解除
  def toggle
    video = Video.find(params[:video_id])
    Rails.logger.debug("video_id: #{video_id}") # この行を追加してみてください
    session_id = session[:session_id]

    # お気に入りがすでに存在しているかどうか
    favorite = Favorite.find_by(video: video, session_id: session_id)
    
    if favorite
      # お気に入りが既にあれば解除
      favorite.destroy
      render json: { status: 'removed' }
    else
      # お気に入りがなければ追加
      Favorite.create(video: video, session_id: session_id)
      render json: { status: 'added' }
    end
  end
end
