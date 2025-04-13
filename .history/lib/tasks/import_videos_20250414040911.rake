# lib/tasks/import_videos.rake
require 'roo'
require 'open-uri'
require 'tempfile'

namespace :videos do
  desc "Import videos from Excel file on Google Drive"
  task import: :environment do
    Video.import_from_file
    puts "動画データのインポートが完了しました。"
  end
end
