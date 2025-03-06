class FavoritesController < ApplicationController
  def toggle
    Rails.logger.debug "📌 受け取った params[:video_id]: #{params[:video_id]}"  # デバッグ用ログ

    # `video_id` で検索
    @video = Video.find_by(video_id: params[:video_id])

    unless @video
      Rails.logger.error "🚨 Video not found for video_id=#{params[:video_id]}"
      return render json: { error: "Video not found" }, status: :not_found
    end

    favorite = Favorite.find_by(video_id: @video.id, session_id: session.id)

    if favorite
      favorite.destroy
      render json: { status: "removed" }
    else
      Favorite.create!(video_id: @video.id, session_id: session.id)
      render json: { status: "added" }
    end
  end
end
