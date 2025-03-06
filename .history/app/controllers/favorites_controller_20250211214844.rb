class FavoritesController < ApplicationController

  # お気に入りを追加または解除
  def toggle
    video = Video.find(params[:video_id])

    # セッションにお気に入り情報を保存
    session[:favorites] ||= []  # セッションにお気に入りの配列がない場合は初期化
    if session[:favorites].include?(video.id)
      # すでにお気に入りに含まれている場合は解除
      session[:favorites].delete(video.id)
      render json: { status: 'removed' }
    else
      # お気に入りに含まれていない場合は追加
      session[:favorites] << video.id
      render json: { status: 'added' }
    end
  end

  # お気に入りリストを取得
  def index
    @favorites = Video.where(id: session[:favorites] || [])
  end
end
