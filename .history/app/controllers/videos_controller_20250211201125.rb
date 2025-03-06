class VideosController < ApplicationController
  def index
    if params[:query].present?
      # 検索クエリが指定された場合、song_titleまたはartistで検索
      @videos = Video.where('song_title LIKE ? OR artist LIKE ?', "%#{params[:query]}%", "%#{params[:query]}%")
    else
      # 検索クエリがない場合は全ての動画を取得
      @videos = Video.all
    end

    if params[:favorite].present?
      @videos = @videos.joins(:favorites).where(favorites: { session_id: session[:session_id] })
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
