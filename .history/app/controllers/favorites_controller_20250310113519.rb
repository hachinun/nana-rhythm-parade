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
      # Favoriteがすでに存在する場合は削除
      if favorite.destroy
        render json: { status: "removed" }
      else
        # 削除に失敗した場合のエラーログとレスポンス
        Rails.logger.error "🚨 Failed to remove favorite for video_id=#{@video.id} and session_id=#{session.id}. Errors: #{favorite.errors.full_messages.join(', ')}"
        render json: { error: "Failed to remove favorite" }, status: :unprocessable_entity
      end
    else
      # Favoriteが存在しない場合、新しく作成
      begin
        favorite = Favorite.create!(video_id: @video.id, session_id: session.id.to_s)
        render json: { status: "added" }
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "🚨 Failed to create favorite: #{e.message}"
        render json: { error: "Failed to add favorite" }, status: :unprocessable_entity
      end
    end
  end
end
