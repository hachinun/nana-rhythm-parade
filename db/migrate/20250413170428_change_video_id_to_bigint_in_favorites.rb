class ChangeVideoIdToBigintInFavorites < ActiveRecord::Migration[7.1]
  def change
    # 外部キーを一旦削除
    remove_foreign_key :favorites, :videos

    # カラムの型を変更（MySQL/TiDBでは一旦削除＋追加が安全）
    change_column :favorites, :video_id, :bigint

    # 外部キーを再追加
    add_foreign_key :favorites, :videos
  end
end
