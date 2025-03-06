require 'roo'

class Video < ApplicationRecord
  def self.import_from_file
    file_path = "C:/Users/myaor/Desktop/nanatama/data/videos.xlsx" # Excelファイルのパス
    return unless File.exist?(file_path) # ファイルが存在しない場合は処理をスキップ

    # 前回の動画データを削除
    Video.delete_all

    # Excelファイルを読み込む
    spreadsheet = Roo::Excelx.new(file_path)

    # 行ごとにデータをインポート
    spreadsheet.each(video_id: 'A', song_title: 'B', artist: 'C', start_seconds: 'D', end_seconds: 'E', video_title: 'F', post_date: 'G') do |row|
      next if row[:video_id] == 'video_id' # ヘッダー行をスキップ

      # 新しいデータを追加
      Video.create(
        video_id: row[:video_id],
        song_title: row[:song_title],
        artist: row[:artist],
        start_seconds: row[:start_seconds],
        end_seconds: row[:end_seconds],
        video_title: row[:video_title],
        post_date: row[:post_date]
      )
    end
  end

  # YouTube サムネイルURLを返すメソッド
  def thumbnail_url
    "https://img.youtube.com/vi/#{video_id}/0.jpg"
  end
end
