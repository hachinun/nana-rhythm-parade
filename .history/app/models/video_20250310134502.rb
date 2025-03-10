require 'roo'

class Video < ApplicationRecord
  has_many :favorites, dependent: :destroy
  has_many :liked_users, through: :favorites, source: :user

  def self.import_from_file
    file_path = "C:/Users/myaor/Desktop/nanatama/data/videos.xlsx"
    return unless File.exist?(file_path)

    Video.delete_all

    spreadsheet = Roo::Excelx.new(file_path)
    spreadsheet.default_sheet = spreadsheet.sheets.first # 最初のシートを選択

    # データのインポート
    spreadsheet.each(video_id: 'video_id', song_title: 'song_title', artist: 'artist', start_seconds: 'start_seconds', end_seconds: 'end_seconds', video_title: 'video_title', post_date: 'post_date') do |row|
      next if row[:video_id] == 'video_id' # ヘッダー行をスキップ

      Video.create!(
        video_id: row[:video_id],
        song_title: row[:song_title],
        artist: row[:artist],
        start_seconds: row[:start_seconds].to_i, # 数値型へ変換
        end_seconds: row[:end_seconds].to_i, # 数値型へ変換
        video_title: row[:video_title],
        post_date: row[:post_date].to_date # 日付型へ変換
      )
    end
  end

  def thumbnail_url
    "https://img.youtube.com/vi/#{video_id}/0.jpg"
  end
end
