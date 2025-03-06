set :output, "log/cron.log"  # ログの出力先
set :environment, "development"  # 環境を指定 (production にする場合は変更)

every 1.hour do
  rake "videos:import"
end