import { Card, CardHeader, CardContent } from "@/components/ui/card";

import * as Types from "@/Types";

const RestaurantPopup = ({
    restaurant,
}: {
    restaurant: Types.RestaurantData;
}) => (
    <Card>
        <CardHeader className="font-bold text-base mb-0 pb-0">
            {restaurant.Cells.TypeObject} {restaurant.Cells.Name}
        </CardHeader>
        <CardContent className="mt-0 ">
            <p>{restaurant.Cells.Name}</p>
            <p>Адрес: {restaurant.Cells.Address}</p>
            <p>Число мест: {restaurant.Cells.SeatsCount}</p>

            <div>
                Контакты:
                <ul className="list-disc ms-9">
                    {restaurant.Cells.PublicPhone.map((phone, index) => (
                        <li key={index}>{phone.PublicPhone}</li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
);

export default RestaurantPopup;
