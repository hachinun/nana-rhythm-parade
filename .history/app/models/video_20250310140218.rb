require 'roo'
require 'open-uri'

class Video < ApplicationRecord
  has_many :favorites, dependent: :destroy
  has_many :liked_users, through: :favorites, source: :user

  def self.import_from_file
    file_url = "https://drive.google.com/uc?id=1v6NP5mU-h6F6651r4eqtZSbrqmU3J5iB&export=download" # Google Driveのダウンロードリンク
    return unless file_url.present?

    # 前回の動画データを削除
    Video.delete_all

    # Google DriveからExcelファイルをダウンロード
    file_content = open(file_url)

    # Excelファイルを読み込む
    spreadsheet = Roo::Excelx.new(file_content)
    spreadsheet.default_sheet = spreadsheet.sheets.first # 最初のシートを選択

    # ヘッダーを確認（デバッグ用）
    header = spreadsheet.row(1) # 1行目をヘッダーとする
    puts "ヘッダー: #{header.inspect}"

    # 行ごとにデータをインポート
    spreadsheet.each(video_id: 'video_id', song_title: 'song_title', artist: 'artist', start_seconds: 'start_seconds', end_seconds: 'end_seconds', video_title: 'video_title', post_date: 'post_date') do |row|
      next if row[:video_id].blank? || row[:video_id] == "video_id" # ヘッダー行をスキップ

      # 新しいデータを作成
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
