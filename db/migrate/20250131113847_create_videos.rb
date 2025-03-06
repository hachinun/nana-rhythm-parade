class CreateVideos < ActiveRecord::Migration[7.1]
  def change
    create_table :videos do |t|
      t.string :video_id
      t.string :song_title
      t.string :artist
      t.integer :start_seconds
      t.integer :end_seconds
      t.string :video_title
      t.date :post_date

      t.timestamps
    end
  end
end
