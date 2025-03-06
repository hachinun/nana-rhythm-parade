class FavoritesController < ApplicationController
  before_action :set_session_id

  def toggle
    favorite = Favorite.find_by(video_id: params[:video_id], session_id: session[:session_id])
    if favorite
      favorite.destroy
      render json: { status: "removed" }
    else
      Favorite.create(video_id: params[:video_id], session_id: session[:session_id])
      render json: { status: "added" }
    end
  end

  private

  def set_session_id
    session[:session_id] ||= SecureRandom.hex(10)
  end
end
