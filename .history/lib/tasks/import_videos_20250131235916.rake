namespace :videos do
  desc "Import videos from Excel file"
  task import: :environment do
    Video.import_from_file
    puts "Videos imported successfully."
  end
end