const config = {
	yad2ResultsURL : [
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=10&arrCity=&arrHomeTypeID=5%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=90&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=&arrCity=1970&Neighborhood=%F8%EE%FA+%E7%EF&arrHomeTypeID=3%2C5%2C39%2C11%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=&arrCity=1970&Neighborhood=%F8%EE%FA+%E0%F4%F2%EC&arrHomeTypeID=3%2C5%2C6%2C39%2C11%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=&arrCity=1970&Neighborhood=%EB%F4%F8+%E0%E6%22%F8&arrHomeTypeID=1%2C3%2C5%2C6%2C4%2C7%2C39%2C49%2C51%2C11%2C32%2C55%2C61%2C31%2C44%2C43%2C33%2C60%2C45%2C50%2C30%2C41&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=&arrCity=1970&Neighborhood=%F9%E9%EB%E5%EF+%F6%F0%E7%F0%E9%ED&arrHomeTypeID=3%2C5%2C39%2C11%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=4&arrCity=&Neighborhood=&arrHomeTypeID=5%2C39%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=100&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=78&arrCity=&arrHomeTypeID=5%2C39%2C32%2C55&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=100&untilSquareMeter=&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?AreaID=2&City=&HomeTypeID=5&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&villages=1&EnterDate=&Info=",
		"http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&AreaID=71&City=&HomeTypeID=5&fromRooms=4&untilRooms=&fromPrice=1000&untilPrice=9000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=100&untilSquareMeter=&LongTerm=1&EnterDate=&Info=",
	]
}
config.sqrFilter = "all"//&& - and; || - or; ! - not; >= - more or equal; all - accept all
config.cityFilter = {
	acceptable:[],
	unacceptable:[
	`גבעת כ"ח`,
	`ראש העין`,
	`בני ברק`,
	`בני עטרות`,
	`לפיד`,
	`בית חנן`,
	`כפר בן נון`,
	`זיתן`,
	`אורנית`,
	`באר יעקב`,
	`אור יהודה`
],
	mode:1
}//0 - only acceptable towns. 1 - only no disacceptable towns

module.exports = config;