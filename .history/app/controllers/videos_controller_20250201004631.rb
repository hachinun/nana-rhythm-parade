# app/controllers/videos_controller.rb
class VideosController < ApplicationController
  def index
    @videos = Video.all # ここで動画データを取得
    @current_video = @videos.first # 動画一覧の最初の動画を表示する
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
