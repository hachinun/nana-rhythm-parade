class FavoritesController < ApplicationController
  before_action :set_video
  before_action :authenticate_user!

  def create
    current_user.favorites.create(video: @video)
    redirect_to videos_path, notice: 'お気に入りに追加しました'
  end

  def destroy
    current_user.favorites.find_by(video: @video)&.destroy
    redirect_to videos_path, notice: 'お気に入りを解除しました'
  end

  private

  def set_video
    @video = Video.find(params[:video_id])
  end
end
