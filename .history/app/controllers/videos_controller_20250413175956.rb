class VideosController < ApplicationController
  def index
    if params[:query].present?
      # 検索クエリが指定された場合、song_titleまたはartistで検索
      @videos = Video.where('song_title LIKE ? OR artist LIKE ?', "%#{params[:query]}%", "%#{params[:query]}%")
    else
      # 検索クエリがない場合は全ての動画を取得
      @videos = Video.all
    end

    # お気に入りのみ表示の場合
    if params[:favorite] == "true"
      # セッションからお気に入りの動画IDを取得
      favorite_ids = session[:favorites] || []
      @videos = @videos.where(id: favorite_ids)
    end
    
    # 動画一覧の最初の動画を表示（検索後も再生中の動画は保持する）
    @current_video = @videos.first || Video.first
  end
end