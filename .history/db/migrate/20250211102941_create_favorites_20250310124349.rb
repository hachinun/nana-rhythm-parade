class CreateFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :favorites do |t|
      t.references :video, null: false, foreign_key: true
      t.string :session_id # もしsession_idが必要なら追加する

      t.timestamps
    end
  end
end
