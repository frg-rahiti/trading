insert into public.products (slug,name,platform,description,price_cents,currency,published)
values
('orb-ema-vwap-atr-ea-v2','ORB_EMA_VWAP_ATR_EA_V2','mt5','',0,'eur',false),
('ict-smc-sweep-fvg-fib-ea-v2','ICT_SMC_Sweep_FVG_Fib_EA_V2','mt5','',0,'eur',false),
('orb-style-emavwap-atr-strategy-xauusd-4h','ORB Style EMAVWAP ATR Strategy XAUUSD 4h','tradingview','',0,'eur',false)
on conflict (slug) do update set name=excluded.name, platform=excluded.platform;

insert into public.product_versions (product_id,version,release_date,ex5_path,pine_path)
select id,'V1',current_date,
 case when slug='orb-ema-vwap-atr-ea-v2' then 'product-1/V1/ORB_EMA_VWAP_ATR_EA_V2.ex5'
      when slug='ict-smc-sweep-fvg-fib-ea-v2' then 'product-2/V1/ICT_SMC_Sweep_FVG_Fib_EA_V2.ex5' end,
 case when slug='orb-style-emavwap-atr-strategy-xauusd-4h' then 'product-3/V1/ORB Style EMAVWAP ATR Strategy XAUUSD 4h.pine' end
from public.products
where slug in ('orb-ema-vwap-atr-ea-v2','ict-smc-sweep-fvg-fib-ea-v2','orb-style-emavwap-atr-strategy-xauusd-4h')
on conflict (product_id,version) do update set ex5_path=excluded.ex5_path,pine_path=excluded.pine_path;
