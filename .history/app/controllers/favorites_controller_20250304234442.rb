class FavoritesController < ApplicationController
  def toggle
    Rails.logger.debug "📌 受け取った params[:video_id]: #{params[:video_id]}"  # デバッグ用ログ

    # `video_id` で検索
    @video = Video.find_by(video_id: params[:video_id])

    unless @video
      Rails.logger.error "🚨 Video not found for video_id=#{params[:video_id]}"
      return render json: { error: "Video not found" }, status: :not_found
    end

    # セッションIDを文字列として扱う
    favorite = Favorite.find_by(video_id: @video.id, session_id: session.id.to_s)

    if favorite
      favorite.destroy
      render json: { status: "removed" }
    else
      Favorite.create!(video_id: @video.id, session_id: session.id.to_s)
      render json: { status: "added" }
    end
  end
end
