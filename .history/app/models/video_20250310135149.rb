require 'roo'

class Video < ApplicationRecord
  has_many :favorites, dependent: :destroy
  has_many :liked_users, through: :favorites, source: :user

  def self.import_from_file
    file_path = "C:/Users/myaor/Desktop/nanatama/data/videos.xlsx" # Excelファイルのパス
    return unless File.exist?(file_path) # ファイルが存在しない場合は処理をスキップ

    # 前回の動画データを削除
    Video.delete_all

    # Excelファイルを読み込む
    spreadsheet = Roo::Excelx.new(file_path)
    spreadsheet.default_sheet = spreadsheet.sheets.first # 最初のシートを選択

    # ヘッダーを確認
    header = spreadsheet.row(1) # 1行目をヘッダーとする
    puts "ヘッダー: #{header.inspect}" # デバッグ用

    # 行ごとにデータをインポート
    spreadsheet.each(video_id: 'video_id', song_title: 'song_title', artist: 'artist', start_seconds: 'start_seconds', end_seconds: 'end_seconds', video_title: 'video_title', post_date: 'post_date') do |row|
      next if row[:video_id].blank? || row[:video_id] == "video_id" # ヘッダー行をスキップ

      # データの作成
      Video.create!(
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
