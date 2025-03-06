class VideosController < ApplicationController
  def index
    if params[:favorite] == 'true'
      # お気に入りのみ表示
      favorite_video_ids = session[:favorites] || []
      @videos = Video.where(id: favorite_video_ids)
    else
      # 通常の表示
      @videos = Video.all
    end

    # 検索機能があれば検索結果を表示
    if params[:query].present?
      @videos = @videos.where("song_title LIKE ? OR artist LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
    end

    respond_to do |format|
      format.html # 通常のレスポンス
      format.js   # Ajaxリクエストの場合
    end
    # 動画一覧の最初の動画を表示（検索後も再生中の動画は保持する）
    @current_video = @videos.first || Video.first
  end
  def import
    if params[:video] && params[:video][:excel_file].present?
      file = params[:video][:excel_file].path
      spreadsheet = Roo::Excelx.new(file)
      
      # Excelの内容をループしてデータを保存
      spreadsheet.each_with_index do |row, index|
        next if index == 0 # ヘッダー行をスキップ

        Video.create(
          video_id: row[0],
          song_title: row[1],
          artist: row[2],
          start_seconds: row[3],
          end_seconds: row[4],
          video_title: row[5],
          post_date: row[6]
        )
      end

      redirect_to videos_path, notice: "Videos imported successfully."
    else
      redirect_to videos_path, alert: "Please upload an Excel file."
    end
  end
end
