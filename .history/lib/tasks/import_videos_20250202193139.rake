namespace :videos do
  desc "Import videos from Excel"
  task import: :environment do
    file_path = "C:/Users/myaor/Desktop/nanatama/data/videos.xlsx"  # 正しいパスに変更
    
    # 既存の動画データを削除
    Video.delete_all
    puts "All existing videos have been deleted."
    
    # Excelファイルを読み込む
    xlsx = Roo::Spreadsheet.open(file_path)
    sheet = xlsx.sheet(0)

    # ヘッダーを明示的に指定する
    sheet.each_row_streaming(offset: 1) do |row|
      # 新しいデータをデータベースに挿入
      video = Video.create!(
        video_id: row[0].value,
        song_title: row[1].value,
        artist: row[2].value,
        start_seconds: row[3].value,
        end_seconds: row[4].value,
        video_title: row[5].value,
        post_date: row[6].value
      )
      puts "Imported video: #{video.song_title} by #{video.artist}"
    end
  end
end
