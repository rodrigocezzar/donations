import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  RadioGroup,
  Select,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router";

import { usePartners } from "../../contexts/PartnersContext";

import { RadioCustom } from "../RadioCustom";
import { DonationValidation } from "./Validation";
import { DonationConfirmModal } from "../DonationConfirmModal";

interface IDonationData {
  partner: string;
  value: string;
}

const schema = DonationValidation;

export const DonationForm = () => {
  const [anyValue, setAnyValue] = useState(false);
  const [data, setData] = useState({} as IDonationData);

  const { state } = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = [30, 70, 150];

  const { partners, renderPartners } = usePartners();

  useEffect(() => {
    renderPartners();
  }, [renderPartners]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm<IDonationData>({ resolver: yupResolver(schema) });

  const onSubmit = (data: IDonationData) => {
    const isEmpty = Object.keys(data).length === 0;

    if (!isEmpty) {
      setData(data);
      onOpen();
    }
  };

  return (
    <>
      <DonationConfirmModal data={data} isOpen={isOpen} onClose={onClose} />
      <Flex
        as="form"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        onSubmit={handleSubmit(onSubmit)}
        maxW="800px"
        marginX="auto"
      >
        <Controller
          control={control}
          name="value"
          render={({ field: { onBlur, onChange, ref } }) => (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <RadioGroup
                name="value"
                gap="8px"
                display={["grid"]}
                gridTemplateColumns={[
                  "repeat(2, 150px)",
                  "repeat(2, 150px)",
                  "repeat(4, 150px)",
                ]}
                justifyItems="center"
                alignItems="center"
              >
                {options.map((value) => (
                  <RadioCustom
                    money
                    key={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    label={`${value}`}
                    value={`${value}`}
                    onClick={() => setAnyValue(false)}
                  />
                ))}
                <RadioCustom
                  onBlur={onBlur}
                  onChange={onChange}
                  label={"Outro valor"}
                  value={"0"}
                  onClick={() => setAnyValue(true)}
                />
              </RadioGroup>
              {anyValue && (
                <Box position="relative" mt={["16px", "32px"]}>
                  <Input
                    type="number"
                    placeholder="Digite quanto deseja doar"
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                    w={["280px", "336px"]}
                    py="16px"
                    pl="40px"
                    _focus={{}}
                  />
                  <Text position="absolute" top="8px" left="15px">
                    R$
                  </Text>
                </Box>
              )}

              {!!errors && (
                <Text color="feedback.danger.regular" fontSize="sm" mt="8px">
                  {errors.value?.message}
                </Text>
              )}

              <Text
                fontSize={["lg", "1xl"]}
                color="gray.250"
                mt={["24px", "48px"]}
                textAlign="center"
                w={["300px", "400px"]}
              >
                Selecione a instituição que deseja ajudar:
              </Text>

              <Select
                {...register("partner")}
                placeholder="Minha instituição"
                mt="24px"
                w={["280px", "336px"]}
                _focus={{}}
              >
                {partners.map((partner, index) => (
                  <option
                    key={index}
                    value={partner.name}
                    selected={state ? state === partner.name : false}
                  >
                    {partner.name}
                  </option>
                ))}
              </Select>
              {!!errors && (
                <Text color="feedback.danger.regular" fontSize="sm" mt="8px">
                  {errors.partner?.message}
                </Text>
              )}
            </Box>
          )}
        />

        <Button
          disabled={!!errors.value?.message || !!errors.partner?.message}
          w={["280px", "350px"]}
          bg="primary.350"
          _hover={{ bg: "primary.300" }}
          type="submit"
          mt="32px"
          _focus={{}}
        >
          Enviar
        </Button>
      </Flex>
    </>
  );
};
